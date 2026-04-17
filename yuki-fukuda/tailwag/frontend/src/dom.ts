// 1. props の型を定義
interface Props {
  [key: string]: string | number | boolean | Function | undefined;
}

// 2. 引数の型を具体的に指定
export function h(
  tag: string,
  props: Props | null,
  ...children: (Node | string | number | null | undefined)[]
): HTMLElement {
  const el = document.createElement(tag);

  // 属性の設定
  if (props) {
    for (const [key, val] of Object.entries(props)) {
      if (key.startsWith("on") && typeof val === "function") {
        // イベントリスナーとして正しく登録
        el.addEventListener(
          key.toLowerCase().substring(2),
          val as EventListener,
        );
      } else {
        // 文字列として属性をセット
        el.setAttribute(key, String(val));
      }
    }
  }

  // 子要素の追加
  children.flat().forEach((child) => {
    if (child !== null && child !== undefined) {
      el.appendChild(
        child instanceof Node ? child : document.createTextNode(String(child)),
      );
    }
  });

  return el;
}

declare global {
  namespace JSX {
    // 1. JSX要素の正体は HTMLElement であると定義

    interface Element extends HTMLElement {}

    // 2. HTMLの標準的なタグ（div, h1など）をすべて許可する

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
