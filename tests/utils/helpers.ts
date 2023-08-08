import { Page, expect } from "@playwright/test";
import LoginPage from "../pages/login";
import SettingsPage from "../pages/settings";
import DashboardPage from "../pages/dashboard";

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

export const assertRank = async (page: Page, rank: number) => {
  const confirmMessage = page.getByText(/Game is over/);
  await confirmMessage.waitFor({ state: "visible" });
  expect(confirmMessage).toContainText(`your rank is ${rank}`);
};

export const assertHasWon = async (
  page: Page,
  startingStats: {
    total: number;
    win: number;
  }
) => {
  const playerDashboard = new DashboardPage(page);
  const playerTotal = await playerDashboard.getTotal();
  const playerWin = await playerDashboard.getWin();
  expect(playerTotal).toBe(startingStats.total + 1);
  expect(playerWin).not.toBeLessThanOrEqual(startingStats.win);
};

export const assertHasLost = async (
  page: Page,
  startingStats: {
    total: number;
    win: number;
  }
) => {
  const playerDashboard = new DashboardPage(page);
  const playerTotal = await playerDashboard.getTotal();
  const playerWin = await playerDashboard.getWin();
  expect(playerTotal).toBe(startingStats.total + 1);
  if (startingStats.win > 0) {
    expect(playerWin).toBeLessThan(startingStats.win);
  } else {
    expect(playerWin).toBe(startingStats.win);
  }
};
