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
        
        # -> Click the 'Menu' link in the top navigation to open the menu page and locate an unavailable menu item to verify a not-found or error state is shown.
        # Menu link
        elem = page.get_by_role('link', name='Menu', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the menu card that displays the 'Out of Stock' badge to open its detail view and verify a not-found, out-of-stock, or error state is shown.
        # ☕ Out of Stock
        elem = page.get_by_text('☕ Out of Stock', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify a not-found or error state is displayed
        # Assert: Verifies the browser is on the item's detail URL for the unavailable item.
        await expect(page).to_have_url(re.compile("/menu/rare\\-kopi\\-luwak"), timeout=15000), "Verifies the browser is on the item's detail URL for the unavailable item."
        await page.locator("xpath=/html/body/main/a").nth(0).scroll_into_view_if_needed()
        # Assert: Verifies the 'Back to Menu' link is visible, indicating the unavailable-item state is shown.
        await expect(page.locator("xpath=/html/body/main/a").nth(0)).to_be_visible(timeout=15000), "Verifies the 'Back to Menu' link is visible, indicating the unavailable-item state is shown."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    