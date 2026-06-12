import { test, expect } from '@playwright/test'

test.describe('Home screen', () => {
  test('renders the app title', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /vinyl identifier/i })).toBeVisible()
  })

  test('shows camera, gallery, and barcode buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /take photo/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /upload from gallery/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /scan barcode/i })).toBeVisible()
  })

  test('navigates to camera screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /take photo/i }).click()
    await expect(page).toHaveURL('/scan/camera')
  })

  test('navigates to barcode screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /scan barcode/i }).click()
    await expect(page).toHaveURL('/scan/barcode')
  })
})

test.describe('Library screen', () => {
  test('shows empty state', async ({ page }) => {
    await page.goto('/library')
    await expect(page.getByText(/no records yet/i)).toBeVisible()
  })

  test('has search input', async ({ page }) => {
    await page.goto('/library')
    await expect(page.getByPlaceholder(/search records/i)).toBeVisible()
  })

  test('has grid/list view toggle', async ({ page }) => {
    await page.goto('/library')
    await expect(page.getByRole('button', { name: /^grid$/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /^list$/i })).toBeVisible()
  })
})

test.describe('Compare screen', () => {
  test('shows empty state prompt', async ({ page }) => {
    await page.goto('/compare')
    await expect(page.getByText(/select records to compare/i)).toBeVisible()
  })
})

test.describe('Settings screen', () => {
  test('renders settings title', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('navigates between screens via nav links', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /library/i })
      .first()
      .click()
    await expect(page).toHaveURL('/library')

    await page
      .getByRole('link', { name: /compare/i })
      .first()
      .click()
    await expect(page).toHaveURL('/compare')

    await page
      .getByRole('link', { name: /settings/i })
      .first()
      .click()
    await expect(page).toHaveURL('/settings')

    await page.getByRole('link', { name: /home/i }).first().click()
    await expect(page).toHaveURL('/')
  })
})
