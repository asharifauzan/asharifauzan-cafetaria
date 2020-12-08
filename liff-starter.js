window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1655319676-3O2PgWmq";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
  initializeLiff(myLiffId);
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
// not loged in user will stuck in login page
    if( !liff.isLoggedIn() ){
      showLogin();
    }
    setWrapper( liff.isLoggedIn() );
    displayStatus();
    displayClient();
    displayUser();
    toggleAccount();
}

function setWrapper(isLogin){
  if(isLogin){
    document.getElementById('wrapper')
    .classList.remove('blank');
  } else {
    document.getElementById('wrapper')
    .classList.add('blank');
  }
}

// show login page (if not loged in)
function showLogin(){
  document.querySelector('.login-wrapper > h1').innerHTML = 'AshariFauzan-Cafetaria';
  document.querySelector('.login-wrapper > p').innerHTML = 'Hai, you need to login first to use this app.';
  document.getElementsByClassName('login-wrapper')[0]
  .classList.remove('blank');
}

// status liff
function displayStatus() {
  document.getElementById('isClient').innerHTML += `<b>${liff.isInClient()}</b>`;
  document.getElementById('isLogin').innerHTML += `<b>${liff.isLoggedIn()}</b>`;
}

// user uses in-app browser or not
function displayClient() {
  let statusClient;
  if( liff.isInClient() ){
    statusClient = "You are using LINE in-app browser.";
  } else {
    // !isClient && isLoggedIn
    if( liff.isLoggedIn() ){
      document.getElementById('account').classList.add('visible');
      document.getElementById('line-login').classList.remove('visible');
    }
    statusClient = "⚠️ You are using external browser, move to LINE in-app browser to use full feautures."
  }
  document.getElementById('status-client').innerHTML = statusClient;
}

// display name and picture user
function displayUser(){
  if( liff.isLoggedIn() ){
    liff.getProfile()
      .then(profile => {
        document.getElementsByClassName('greeting')[0].innerHTML = `Hallo ${profile.displayName}, selamat datang di AshariFauzan-gopud. Ayo belanja`;
        document.querySelector('#account > img').src = profile.pictureUrl;
      })
      .catch((err) => {
        console.log('error', err);
      });
  }
}

// handle user login
function handleLogin() {
  if( !liff.isLoggedIn() ){
    liff.login();
  }
};

// handle user logout
function handleLogout(){
  document.getElementById('line-logout')
  .addEventListener('click', function(){
    if( liff.isLoggedIn() ){
      liff.logout();
      window.location.reload();
    }
  });
}

function toggleAccount(){
  document.querySelector('#account > img')
  .addEventListener('click', function(){
    document.querySelector('#account > ul').classList.toggle('blank');
  });
}

function sendAlertIfNotInClient(feature) {
  document.getElementById('error-client').innerHTML = `
  <h1>Error</h1>
  <p>⚠️ Fitur ${feature} hanya tersedia di LINE in-app browser.</p>`;
}
