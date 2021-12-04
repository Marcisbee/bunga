---
to: src/features/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.tsx
---
<% camelized = h.changeCase.pascal(name) -%>
import style from './<%= h.changeCase.paramCase(name) %>.module.scss';

interface <%= camelized %>ComponentProps {}

export function <%= camelized %>Component({}: <%= camelized %>ComponentProps) {
  return (
    <div><%= camelized %></div>
  );
}
