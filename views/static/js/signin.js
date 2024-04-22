// const btn = document.querySelector('button');
// btn.addEventListener('click', () => {
//     console.log("Cliked Me~~~~~~~~~~~~~~~~~~~~~~~~~~")
//     const title = document.querySelector('title');
//     title.textContent = "xxxxxxx"
// });


const loginBtn = document.querySelector("#login-btn");
loginBtn.addEventListener('click', signin);

async function signin() {
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-pwd").value;
    const data = { email: email, password: password };
    await axios.post('/api/auth/signin', data)
    .then((result) => {
        if(result.data) {
            console.log("로그인 성공!")
            console.log("result: ", result);
            console.log("result.data: ", result.data);
            // form태그로 리다이렉트?
        } else {
            console.log("이메일 또는 비밀번호가 틀렸습니다.")
        }
    })
}