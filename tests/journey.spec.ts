import { test, expect } from '@playwright/test';

test('personal opening, story navigation, and original playground', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Curious mind.');
  await page.getByRole('link', { name: 'Step into my story' }).click();
  await expect(page).toHaveURL(/#story/);
  await page.getByRole('button', { name: '2023', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The work became real.' })).toBeVisible();
  await page.getByRole('link', { name: '02 The playground' }).click();
  await expect(page.getByText('PERSONAL EXPERIMENTS — CREATED FOR THIS SITE')).toBeVisible();
  await expect.poll(() => errors).toEqual([]);
});

test('tactile feedback and color composer respond to input', async ({ page }) => {
  await page.goto('/#play');
  await page.getByRole('button', { name: 'Press the tactile button' }).click();
  await expect(page.getByText('01 LITTLE MOMENT OF SATISFACTION')).toBeVisible();
  await page.getByRole('button', { name: 'Press the tactile button' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('02 LITTLE MOMENTS OF SATISFACTION')).toBeVisible();
  await page.getByRole('button', { name: 'Tangerine palette' }).click();
  await expect(page.getByRole('button', { name: 'Tangerine palette' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.palette-picker .micro')).toHaveText('Tangerine');
  await page.getByRole('button', { name: 'Forest palette' }).click();
  await expect(page.locator('.palette-picker .micro')).toHaveText('Forest');
});

test('focus timer can run, pause, reset, and finish', async ({ page }) => {
  await page.clock.install();
  await page.goto('/#play');
  await page.getByRole('button', { name: 'Take a minute' }).click();
  await page.clock.runFor(2200);
  await expect(page.locator('.clock-time')).toHaveAttribute(
    'aria-label',
    /5[78] seconds remaining/,
  );
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await page.locator('.clock-time').getAttribute('aria-label');
  await page.clock.runFor(2000);
  await expect(page.locator('.clock-time')).toHaveAttribute('aria-label', paused!);
  await page.getByRole('button', { name: 'Reset focus timer' }).click();
  await expect(page.locator('.clock-time')).toHaveAttribute('aria-label', '60 seconds remaining');
  await page.getByRole('button', { name: 'Take a minute' }).click();
  await page.clock.runFor(60_100);
  await expect(page.getByText('A small pause. A fresh start.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Another minute' })).toBeVisible();
});

test('mobile navigation and timeline are keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('dialog').getByRole('link', { name: '01 The story' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'There is more to figure out.' })).toBeVisible();
});

test('public profile downloads and layout fits small and large screens', async ({
  page,
  request,
}) => {
  const response = await request.get('/dharmveer-kumar-resume.pdf');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await page.goto('/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      `overflow at ${width}px`,
    ).toBe(false);
  }
});

test('all revealed sections pass the automated accessibility checks', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  await page.goto('/');
  for (const id of ['story', 'play', 'approach', 'next', 'contact'])
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
    .analyze();
  expect(
    result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((n) => n.target) })),
  ).toEqual([]);
});

test('sculpture has a working keyboard-accessible perspective control', async ({ page }) => {
  await page.goto('/');
  const control = page.getByRole('button', { name: 'Rotate sculpture' });
  await expect(control).toBeVisible();
  await page.waitForTimeout(500);
  const sculpture = page.locator('.sculpture-scene');
  const before = await sculpture.screenshot();
  await control.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  expect((await sculpture.screenshot()).equals(before)).toBe(false);
});
