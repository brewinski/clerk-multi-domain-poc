import ThemeLayout from "@cns/components/ThemeLayout";
import { ThemeType } from "@cns/themes/themeConfig";

export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const themeType: ThemeType = "canstarblue"

  return <ThemeLayout themeType={themeType}>
    {children}
  </ThemeLayout>
}
