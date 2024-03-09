document.addEventListener("DOMContentLoaded", () => {
      document.getElementById('navbarToggle').addEventListener('click', () => {
            const navbarLinks = document.getElementById('navbarLinks');
            const hotTable = document.getElementById('attendance-data-table');
            const dataTable = document.querySelector('#documentTable');

            if(navbarLinks.style.display === 'block'){
                  navbarLinks.style.display = 'none';
                  document.querySelector('.vertical-navbar').style.width = '60px';
                  document.querySelector('.navbar-icon').style.marginLeft = '0';
                  if(dataTable){dataTable.classList.add('expanded-table');}
                  if(hotTable){hotTable.classList.add('expanded-hanson'); }
                  
            }else{
                  navbarLinks.style.display = 'block';
                  document.querySelector('.vertical-navbar').style.width = '200px';
                  document.querySelector('.navbar-icon').style.marginLeft = '-4em';
                  if(dataTable){ dataTable.classList.remove('expanded-table');}
                  if(hotTable){hotTable.classList.remove('expanded-hanson');}
            }
      })
})