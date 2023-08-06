import { Page } from "@playwright/test";
import LoginPage from "../pages/login";
import SettingsPage from "../pages/settings";

export const getSetting = (
  mode: "standard" | "relaxed",
  difficulty: "easy" | "hard",
  describer: "text" | "voice"
) => {
  return {
    mode,
    difficulty,
    describer,
  };
};

export const logInAndChooseSettings = async (
  page: Page,
  user: {
    email: string;
    password: string;
  },
  settings: {
    mode: "standard" | "relaxed";
    difficulty: "easy" | "hard";
    describer: "text" | "voice";
  }
) => {
  await page.goto("/login");

  const login = new LoginPage(page);
  await login.login(user);

  await page.getByRole("button", { name: "Play" }).click();

  const settingsPage = new SettingsPage(page);
  await settingsPage.setSettings(settings);
  const readyButton = page.getByRole("button", { name: "Ready" });
  await readyButton.waitFor({ state: "visible" });
  await readyButton.click();
};
