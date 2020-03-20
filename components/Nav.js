// if (link.title !== "Home") {
//   return link.title
// } else {
//   return ""
// }

export default links => `
<nav>
  <i class="fas fa-bars"></i>
  <ul class="hidden--mobile nav-links">
  ${links.reduce(
    (html, link) =>
      html +
      `<li><a href="/${link.title !== "Home" ? link.title : ""}" title="${
        link.title
      }" data-navigo>${link.text}</a></li>`,
    ``
  )}
  </ul>
</nav>
`;
