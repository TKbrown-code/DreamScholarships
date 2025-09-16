import { useEffect } from "react";
import i18n from "../i18n";

export default function AutoTranslator() {
  useEffect(() => {
    const translateNode = (node) => {
      // Text node
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (text && i18n.exists(text)) {
          node.nodeValue = i18n.t(text);
        }
      }

      // Attributes
      if (node.nodeType === Node.ELEMENT_NODE) {
        ["placeholder", "title", "alt"].forEach(attr => {
          const value = node.getAttribute(attr);
          if (value && i18n.exists(value.trim())) {
            node.setAttribute(attr, i18n.t(value.trim()));
          }
        });
      }

      // Recursively translate children
      node.childNodes.forEach(translateNode);
    };

    const translateAll = () => translateNode(document.body);

    // Initial translation after a tick to ensure React rendered
    setTimeout(translateAll, 0);

    // Translate on language change
    i18n.on("languageChanged", translateAll);

    // Observe dynamically added content
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => translateNode(node));
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      i18n.off("languageChanged", translateAll);
      observer.disconnect();
    };
  }, []);

  return null;
}
