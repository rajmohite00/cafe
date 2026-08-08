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
        
        # -> Click the 'Menu' link in the top navigation to open the menu page.
        # Menu link
        elem = page.get_by_role('link', name='Menu', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Beverages' category button to filter the menu to beverages, then open the Masala Chai item by clicking its image to view the detail page.
        # Beverages button
        elem = page.get_by_role('button', name='Beverages', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Beverages' category button to filter the menu to beverages, then open the Masala Chai item by clicking its image to view the detail page.
        # Masala Chai
        elem = page.locator('xpath=/html/body/main/div[2]/div[2]/div/div/img')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the item detail page is displayed
        # Assert: URL contains /menu/masala-chai confirming the item detail page is open.
        await expect(page).to_have_url(re.compile("/menu/masala\\-chai"), timeout=15000), "URL contains /menu/masala-chai confirming the item detail page is open."
        await page.locator("xpath=/html/body/main/section[1]/div/div[2]/div[5]/div/button").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Add to Cart' button is visible on the item detail page.
        await expect(page.locator("xpath=/html/body/main/section[1]/div/div[2]/div[5]/div/button").nth(0)).to_be_visible(timeout=15000), "The 'Add to Cart' button is visible on the item detail page."
        # Assert: The item rating displays '4.9' on the detail page.
        await expect(page.locator("xpath=/html/body/main/section[1]/div/div[2]/div[2]/span[1]").nth(0)).to_have_text("4.9", timeout=15000), "The item rating displays '4.9' on the detail page."
        
        # --> Verify item detail content is displayed
        # Assert: The item rating '4.9' is displayed on the item detail page.
        await expect(page.locator("xpath=/html/body/main/section[1]/div/div[2]/div[2]/span[1]").nth(0)).to_have_text("4.9", timeout=15000), "The item rating '4.9' is displayed on the item detail page."
        # Assert: The Add to Cart button for the item is visible.
        await expect(page.locator("xpath=/html/body/main/section[1]/div/div[2]/div[5]/div/button").nth(0)).to_contain_text("Add to Cart", timeout=15000), "The Add to Cart button for the item is visible."
        # Assert: The Back to Menu link is visible on the item detail page.
        await expect(page.locator("xpath=/html/body/main/div/div/a").nth(0)).to_have_text("Back to Menu", timeout=15000), "The Back to Menu link is visible on the item detail page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    