function loginApi(data) {
  return $axios({
    'url': 'http://781s6i8919.goho.co:56863/login',
    'method': 'post',
    data
  })
}


function logoutApi(){
  return $axios({
    'url': '781s6i8919.goho.co:56863/logout',
    'method': 'post',
  })
}
