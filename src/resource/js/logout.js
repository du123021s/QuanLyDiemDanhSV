document.addEventListener("DOMContentLoaded", () => {
      const logoutId = document.getElementById('logoutLink');

      logoutId.addEventListener('click', (event) => {
            // Ngăn chăn chuyển trang mặc định của link
            event.preventDefault();

            // Gửi request đến server xử lý logout
            const option = {
                  method: 'GET',
                  headers: {
                        'Content-Type': 'application/json'
                  }
            }
            fetch('/logout', option)
                  .then(respone => {
                        if (!respone.ok) {
                              throw new Error("Network respone was not ok");
                        }
                        return respone.json();
                  })
                  .then(data => {
                        window.location.href = '/login';
                  })
                  .catch(error => {
                        console.error('Fetch error:', error);
                  });
      })
})