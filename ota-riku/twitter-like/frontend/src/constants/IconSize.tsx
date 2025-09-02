// アイコンのサイズフォーマット
export const ICON_SIZES = {
  PROFILE: 200,
  TL: 70,
  REPLY: 50,
};

export type IconSize = (typeof ICON_SIZES)[keyof typeof ICON_SIZES];
