javascript: 
async function getName(authToken) {    
  const response = await fetch('https://api.blooket.com/api/users/verify-token?token=JWT+%27 + authToken);    
  const data = await response.json();    
  return data.name
};
async function addTokens() {   
  const myToken = localStorage.token.split(%27JWT %27)[1];    
  const response = await fetch("https://api.blooket.com/api/users/add-rewards", {        
    method: "PUT",        
    headers: {            
      "referer": "https://www.blooket.com/",            
      "content-type": "application/json",            
      "authorization": localStorage.token        
    },        
    body: JSON.stringify({            
      name: await getName(myToken),            
      addedTokens: 1000,            
      addedXp: 300        
    })    
  });    
  if (response.status == 200) {        
    alert(`1000 added to your account!`);    
  } else {        
    alert("An error occured.");    
  };
};
addTokens();
