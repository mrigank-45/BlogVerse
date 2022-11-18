// Comment js
var post = document.getElementById("post");
if (post) {
    post.addEventListener("click", function () {
        var commentBoxValue = document.getElementById("comment-box").value;

        var li = document.createElement("li");
        var text = document.createTextNode(commentBoxValue);
        li.appendChild(text);
        document.getElementById("unordered").appendChild(li);
        document.getElementById("comment-box").value = "";

    });
}


// Like js
const button = document.querySelector('.bll')

button.addEventListener('click', () => {
    button.classList.toggle('liked')
})
