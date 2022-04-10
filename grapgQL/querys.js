const myDevices = (userName) =>`query listMyModelTypes {
    listMyModelTypes(filter: {user: {eq: "${userName}"}}) {
      items {
        id
        user
        time
        device
      }
    }
  }
  `;
  
export{
  myDevices
}