import { Page, expect, test } from "@playwright/test";
import LoginPage from "./pages/login";
import { credentials } from "./data/data";

test.describe("Profile", () => {
  let user: Page;

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");

    const login = new LoginPage(page);
    await login.login(credentials.user2);
    await page.waitForURL("/dashboard");
    user = page;
  });

  test("User can change username", async () => {
    await user.getByLabel("Edit").click();
    await user.getByRole("textbox").click();
    await user.getByRole("textbox").fill("New Name");
    await user.getByLabel("Done").click();
    const newUsername = await user.getByTestId("username").textContent();
    expect(newUsername).toBe("New Name");
  });

  test("Long usernames aren't allowed", async () => {
    await user.getByLabel("Edit").click();
    await user.getByRole("textbox").click();
    await user.getByRole("textbox").fill("A very long username");
    await user.getByLabel("Done").click();
    const errorMessage = await user.getByTestId("error-message").textContent();
    expect(errorMessage).toBe("Username must be at most 10 characters");
    expect(user.getByLabel("Done")).toBeInViewport();
  });

  test("User can change profile image", async () => {
    const avatar = user.getByAltText("user avatar");
    const avatarSrc = await avatar.getAttribute("src");
    await avatar.waitFor({ state: "visible" });

    await user.setInputFiles(
      'input[type="file"]',
      "tests/assets/avatar-woman.png"
    );
    await user.waitForTimeout(3000);
    const newAvatarSrc = await avatar.getAttribute("src");
    expect(newAvatarSrc).not.toBe(avatarSrc);
  });

  test("Unsupported file format", async () => {
    const avatar = user.getByAltText("user avatar");
    await avatar.waitFor({ state: "visible" });

    await user.setInputFiles('input[type="file"]', "tests/assets/pdf.pdf");
    const errorMessage = await user.getByTestId("error-message").textContent();
    expect(errorMessage).toBe("Only image files are allowed");
  });
});
