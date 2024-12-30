from playwright.sync_api import sync_playwright
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def test_task_management():
    with sync_playwright() as p:
        try:
            # Launch browser with slower timeouts
            logging.info("Launching browser")
            browser = p.chromium.launch(headless=True, slow_mo=1000)
            context = browser.new_context()
            page = context.new_page()
            logging.info("Browser launched successfully")

            # Navigate to login page with timeout
            logging.info("Navigating to login page")
            page.goto("http://localhost:3000/login", timeout=60000)
            
            # Wait for login form to be visible
            logging.info("Waiting for login form")
            page.wait_for_selector('#signin-email', state="visible", timeout=30000)
            
            # Fill login form
            logging.info("Filling login form")
            page.fill('#signin-email', 'jr@adfs.tax')
            page.fill('input[name="password"]', 'Install55!!')
            
            # Click login button
            logging.info("Submitting login form")
            page.click('button[type="submit"]', timeout=30000)
            
            # Wait for login to complete
            page.wait_for_url("http://localhost:3000/dashboard")
            
            # Test 1: Navigate to tasks page
            page.goto("http://localhost:3000/tasks")
            page.wait_for_selector('text=Loading tasks...', state='hidden')
            
            # Verify tasks are displayed
            assert page.is_visible('text=Tasks'), "Tasks page not loaded correctly"
            
            # Test 2: Create new task
            logging.info("Creating new task")
            page.wait_for_selector('button:has-text("Add Task")', state="visible", timeout=30000)
            page.click('button:has-text("Add Task")')
            
            # Fill task form
            logging.info("Filling task form")
            page.wait_for_selector('input[name="name"]', state="visible", timeout=30000)
            page.fill('input[name="name"]', 'Test Task')
            page.fill('textarea[name="description"]', 'This is a test task')
            
            # Save task
            logging.info("Saving task")
            page.click('button:has-text("Save")', timeout=30000)
            
            # Verify task creation
            logging.info("Verifying task creation")
            page.wait_for_selector('text=Test Task', state="visible", timeout=60000)
            assert page.is_visible('text=Test Task'), "Task creation failed"
            
            # Test 3: Edit task
            logging.info("Editing task")
            task_card = page.locator('text=Test Task').first
            task_card.hover()
            page.wait_for_selector('button:has-text("Edit")', state="visible", timeout=30000)
            task_card.locator('button:has-text("Edit")').click()
            
            # Update task
            logging.info("Updating task")
            page.wait_for_selector('input[name="name"]', state="visible", timeout=30000)
            page.fill('input[name="name"]', 'Updated Test Task')
            page.click('button:has-text("Save")', timeout=30000)
            
            # Verify task update
            logging.info("Verifying task update")
            page.wait_for_selector('text=Updated Test Task', state="visible", timeout=60000)
            assert page.is_visible('text=Updated Test Task'), "Task update failed"
            
            # Test 4: Delete task
            logging.info("Deleting task")
            task_card = page.locator('text=Updated Test Task').first
            task_card.hover()
            page.wait_for_selector('button:has-text("Delete")', state="visible", timeout=30000)
            task_card.locator('button:has-text("Delete")').click()
            
            # Confirm deletion
            logging.info("Confirming deletion")
            page.wait_for_selector('button:has-text("Confirm")', state="visible", timeout=30000)
            page.click('button:has-text("Confirm")')
            
            # Verify task deletion
            logging.info("Verifying task deletion")
            page.wait_for_selector('text=Updated Test Task', state='hidden', timeout=60000)
            assert page.is_hidden('text=Updated Test Task'), "Task deletion failed"
            
            print("All tests passed successfully!")
            
        except Exception as e:
            print(f"Test failed: {str(e)}")
            # Take screenshot on failure
            page.screenshot(path='test_failure.png')
            raise
            
        finally:
            browser.close()

if __name__ == "__main__":
    test_task_management()
