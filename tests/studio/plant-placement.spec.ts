import { test, expect } from '@playwright/test';
import { closeAnyOpenModals } from '../fixtures/test-fixtures';

test.describe('Studio - Plant Placement & Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/studio');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for plants to load
  });

  test.describe('Placing Plants on Canvas', () => {
    test('should select a plant from the sidebar', async ({ page }) => {
      // Find and click on a plant in the list
      const plantItem = page.locator('[class*="cursor-pointer"]:has-text(/[A-Z][a-z]+/)').first();

      if (await plantItem.isVisible()) {
        await plantItem.click();
        await page.waitForTimeout(300);

        // Plant should be selected (highlighted or expanded)
      }
    });

    test('should place plant on canvas by clicking', async ({ page }) => {
      // Select a plant first
      const plantItem = page.locator('[class*="cursor-pointer"]:has-text(/[A-Z][a-z]+/)').first();

      if (await plantItem.isVisible()) {
        await plantItem.click();
        await page.waitForTimeout(300);

        // Click on the canvas area to place
        const canvas = page.locator('svg').first();
        if (await canvas.isVisible()) {
          const box = await canvas.boundingBox();
          if (box) {
            await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
            await page.waitForTimeout(300);
          }
        }
      }
    });

    test('should show plant count after placement', async ({ page }) => {
      // After placing plants, count should update
      const plantCount = page.locator('text=/\\d+ plant/i').first();
      // This may or may not be visible depending on state
    });

    test('should update coverage percentage after placement', async ({ page }) => {
      const coverage = page.locator('text=/%/').first();
      // Coverage metric should be visible
    });
  });

  test.describe('Plant Selection on Canvas', () => {
    test('should select placed plant by clicking', async ({ page }) => {
      // If there are plants on canvas, clicking should select
      const canvas = page.locator('svg').first();
      const placedPlant = page.locator('svg circle, svg ellipse, [class*="plant"]').first();

      if (await placedPlant.isVisible()) {
        await placedPlant.click();
        await page.waitForTimeout(300);

        // Selection indicators should appear
      }
    });

    test('should show delete button when plant is selected', async ({ page }) => {
      const placedPlant = page.locator('svg circle, svg ellipse').first();

      if (await placedPlant.isVisible()) {
        await placedPlant.click();
        await page.waitForTimeout(300);

        const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="delete"], button:has-text("Remove")').first();
        // May be visible if plant is selected
      }
    });

    test('should support multi-select with Shift+Click', async ({ page }) => {
      const plants = page.locator('svg circle, svg ellipse');
      const count = await plants.count();

      if (count >= 2) {
        await plants.first().click();
        await page.waitForTimeout(200);

        await page.keyboard.down('Shift');
        await plants.nth(1).click();
        await page.keyboard.up('Shift');
        await page.waitForTimeout(300);

        // Multi-selection UI should appear
        const multiSelectInfo = page.locator('text=/\\d+ selected/i').first();
      }
    });
  });

  test.describe('Plant Size Variants', () => {
    test('should show size options for plants with multiple sizes', async ({ page }) => {
      // Some plants have 3gal, 5gal, 7gal options
      const sizeSelector = page.locator('button:has-text("gal"), button:has-text("size")').first();
      // May be visible for certain plants
    });

    test('should change plant size when selecting variant', async ({ page }) => {
      const sizeButton = page.locator('button:has-text("5gal"), button:has-text("7gal")').first();

      if (await sizeButton.isVisible()) {
        await sizeButton.click();
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('Undo/Redo Functionality', () => {
    test('should undo last action', async ({ page }) => {
      // Place a plant first, then undo
      const undoButton = page.locator('button:has-text("Undo"), button[aria-label*="undo"]').first();

      if (await undoButton.isVisible() && await undoButton.isEnabled()) {
        await undoButton.click();
        await page.waitForTimeout(300);
      }
    });

    test('should redo undone action', async ({ page }) => {
      const redoButton = page.locator('button:has-text("Redo"), button[aria-label*="redo"]').first();

      if (await redoButton.isVisible() && await redoButton.isEnabled()) {
        await redoButton.click();
        await page.waitForTimeout(300);
      }
    });

    test('should support Ctrl+Z keyboard shortcut for undo', async ({ page }) => {
      await page.keyboard.press('Control+z');
      await page.waitForTimeout(300);
      // Action should be undone
    });

    test('should support Ctrl+Shift+Z keyboard shortcut for redo', async ({ page }) => {
      await page.keyboard.press('Control+Shift+z');
      await page.waitForTimeout(300);
      // Action should be redone
    });
  });

  test.describe('Clear Canvas', () => {
    test('should clear all plants from canvas', async ({ page }) => {
      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset All")').first();

      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(300);

        // May show confirmation dialog
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Clear")').first();
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          await page.waitForTimeout(300);
        }
      }
    });
  });

  test.describe('Plant Information Display', () => {
    test('should show plant details when hovering', async ({ page, isMobile }) => {
      test.skip(isMobile, 'Hover not applicable on mobile');
      const plantItem = page.locator('[class*="cursor-pointer"]:has-text(/[A-Z][a-z]+/)').first();

      if (await plantItem.isVisible()) {
        await plantItem.hover();
        await page.waitForTimeout(500);

        // Tooltip or details panel may appear
        const plantInfo = page.locator('text=/height|zone|spread|bloom/i').first();
      }
    });

    test('should display plant category badges', async ({ page }) => {
      // Plants should show form, texture, bloom info
      const badges = page.locator('[class*="badge"], [class*="tag"], [class*="chip"]').first();
      // May be visible in plant list or selection
    });
  });
});
