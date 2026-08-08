import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll the home page down to reveal the 'Featured' menu section or the site's menu items (look for headings like 'Featured', 'Our Menu', or visible menu cards) and verify that featured menu content is displayed.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll down the page to bring the 'Our Menu' section into view and verify that menu elements (the 'Our Menu' heading, category buttons like 'All'/'Beverages'/'Snacks', and menu items such as 'Masala Chai' and 'Samosa Chaat') are visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll down to bring the menu item cards into view and verify menu items 'Masala Chai', 'Samosa Chaat', and 'Paneer Tikka Sandwich' and their 'Add' buttons are visible on the page.
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> Verify the main home page content is displayed
        # Assert: The header logo reads 'Raj's Cafe' and is visible on the home page.
        await expect(page.locator("xpath=/html/body/header/div/a").nth(0)).to_have_text("Raj's Cafe", timeout=15000), "The header logo reads 'Raj's Cafe' and is visible on the home page."
        # Assert: The 'Book a Table' link is visible in the header, confirming main navigation is shown.
        await expect(page.locator("xpath=/html/body/header/div/div/a[2]").nth(0)).to_have_text("Book a Table", timeout=15000), "The 'Book a Table' link is visible in the header, confirming main navigation is shown."
        await page.locator("xpath=/html/body/main/section[2]/div/div/div[2]/div[3]/div[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The main landing hero content container is visible on the home page.
        await expect(page.locator("xpath=/html/body/main/section[2]/div/div/div[2]/div[3]/div[1]").nth(0)).to_be_visible(timeout=15000), "The main landing hero content container is visible on the home page."
        
        # --> Verify featured menu content is displayed
        # Assert: The Masala Chai menu item is visible in the featured menu.
        await expect(page.locator("xpath=/html/body/main/section[3]/div/div[3]/div[1]/div[2]/h3").nth(0)).to_have_text("Masala Chai", timeout=15000), "The Masala Chai menu item is visible in the featured menu."
        # Assert: The Samosa Chaat menu item is visible in the featured menu.
        await expect(page.locator("xpath=/html/body/main/section[3]/div/div[3]/div[2]/div[2]/h3").nth(0)).to_have_text("Samosa Chaat", timeout=15000), "The Samosa Chaat menu item is visible in the featured menu."
        # Assert: The Paneer Tikka Sandwich menu item is visible in the featured menu.
        await expect(page.locator("xpath=/html/body/main/section[3]/div/div[3]/div[3]/div[2]/h3").nth(0)).to_have_text("Paneer Tikka Sandwich", timeout=15000), "The Paneer Tikka Sandwich menu item is visible in the featured menu."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    