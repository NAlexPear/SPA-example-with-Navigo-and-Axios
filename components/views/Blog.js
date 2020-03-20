import { capitalize } from "lodash";

export default st => {
  console.log("piece of state", st);
  return `
<section id="blog">
  ${st.posts.map(post => formatBlogPost(post)).join("")}
</section>
`;
};

function formatBlogPost(post) {
  return `
  <div class="blog-post">
    <h4>${capitalize(post.title)} by User ${post.userId}</h4>
    <p>${capitalize(post.body)}</p>
  </div>
  `;
}

// const formatBlogPost = post => `
//   <div class="blog-post">
//     <h4>${capitalize(post.title)} by User ${post.userId}</h4>
//     <p>${capitalize(post.body)}</p>
//   </div>
//   `;
