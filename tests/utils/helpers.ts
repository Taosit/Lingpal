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

  const total = parseInt(
    (await page.getByTestId("total").textContent()) as string
  );

  const win = parseFloat(
    (await page.getByTestId("win").textContent()) as string
  );

  await page.getByRole("button", { name: "Play" }).click();

  const settingsPage = new SettingsPage(page);
  await settingsPage.setSettings(settings);
  return { total, win };
};
