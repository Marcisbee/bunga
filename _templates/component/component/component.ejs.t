---
to: src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.tsx
---
<% camelized = h.changeCase.pascal(name) -%>
import style from './<%= h.changeCase.paramCase(name) %>.module.scss';

interface <%= camelized %>Props {}

export function <%= camelized %>({}: <%= camelized %>Props) {
  return (
    <div><%= camelized %></div>
  );
}
