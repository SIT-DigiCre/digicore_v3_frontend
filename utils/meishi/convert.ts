import { sanitize } from "dompurify";

export const convertNodes = (nodes: NodeList): Element[] => {
  const result: Element[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const converted = convertNode(nodes.item(i));
    if (converted) {
      result.push(converted);
    }
  }
  return result;
};

export const convertNode = (node: Node): Element | null => {
  console.log(node);
  if (node instanceof Element) {
    let elem = node;
    //const classnames = getClassnamesFromElem(elem);
    if (elem.tagName === "NAME") {
      let newElem = document.createElement("span");
      newElem.className = "name";
      newElem.innerHTML = "おなまえ";
      return newElem;
    } else if (elem.tagName === "TEAM") {
      let newElem = document.createElement("span");
      newElem.className = "team";
      newElem.innerHTML = "班名";
      return newElem;
    } else if (elem.tagName === "ICON") {
      let newElem = document.createElement("img");
      newElem.className = "icon";
      newElem.src = "icon";
      return newElem;
    } else if (elem.tagName === "LOGO") {
      let newElem = document.createElement("img");
      newElem.className = "logo";
      newElem.src = "/image/logo.png";
      return newElem;
    } else if (elem.tagName === "STYLE") {
      return elem;
    }
    //elem.className += classnames;
    elem.innerHTML = elemsToHtml(convertNodes(elem.childNodes));
    return elem;
  } else {
    if (node.textContent) {
      const trimedText = node.textContent.trim();
      if (trimedText.length !== 0) {
        let newElem = document.createElement("span");
        newElem.innerText = node.textContent;
        return newElem;
      }
    }
    return null;
  }
};

export const elemsToHtml = (elems: Element[] | HTMLElement[]): string => {
  let result = "";
  for (const elem of elems) {
    result += elem.outerHTML;
  }
  return result;
};

export const textToHtml = (text: string): string => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(text, "text/html");
  return htmlSanitize(elemsToHtml(convertNodes(parsed.body.childNodes)));
};

export const markupToFullHtml = (markup: string): string => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(markup, "text/html");
  const bodyRawHtml = htmlSanitize(elemsToHtml(convertNodes(parsed.body.childNodes)));
  let result = parsed;
  console.log(result);
  result.body.innerHTML = bodyRawHtml;
  return result.documentElement.outerHTML;
};

export const htmlSanitize = (html: string): string => {
  const sanitizeConfig = {
    ADD_TAGS: ["style", "#text"],
  };
  return sanitize(html, sanitizeConfig);
};
