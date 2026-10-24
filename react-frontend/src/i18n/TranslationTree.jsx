import { Children, cloneElement, isValidElement } from "react";
import { useLanguage } from "./useLanguage";

function translateChild(child, t) {
  if (typeof child === "string") {
    const trimmed = child.trim();
    if (!trimmed) return child;
    return child.replace(trimmed, t(trimmed));
  }

  if (!isValidElement(child)) return child;

  const nextProps = {};
  ["aria-label", "placeholder", "title"].forEach((attribute) => {
    if (typeof child.props[attribute] === "string") {
      nextProps[attribute] = t(child.props[attribute]);
    }
  });

  if (child.props.children !== undefined) {
    nextProps.children = Children.map(child.props.children, (nestedChild) => translateChild(nestedChild, t));
  }

  return cloneElement(child, nextProps);
}

export function TranslationTree({ children }) {
  const { t } = useLanguage();
  return Children.map(children, (child) => translateChild(child, t));
}
