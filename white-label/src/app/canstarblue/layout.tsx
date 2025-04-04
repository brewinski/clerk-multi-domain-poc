import ThemedPage from "@cns/components/ThemedPage";
import ThemeLayout from "@cns/components/ThemeLayout";
import { ThemeType } from "@cns/themes/themeConfig";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canstar Blue",
  icons: {
    icon: `blue-favicon.ico`,
  },
}

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const themeType: ThemeType = "canstarblue"

  return <ThemeLayout themeType={themeType}>
    <ThemedPage>
      {children}
    </ThemedPage>
  </ThemeLayout>
}
