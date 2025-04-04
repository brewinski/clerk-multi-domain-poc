import ThemeLayout from "@cns/components/ThemeLayout";
import { ThemeType } from "@cns/themes/themeConfig";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canstar",
  icons: {
    icon: `gold-favicon.ico`,
  },
}

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const themeType: ThemeType = "canstar"

  return <ThemeLayout themeType={themeType}>
    {children}
  </ThemeLayout>
}
