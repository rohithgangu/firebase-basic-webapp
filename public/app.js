const auth = firebase.auth();

const whensignedin = document.getElementById('whensignedin');

const whensignedout = document.getElementById('whensignedout');

const signinbtn = document.getElementById('signinbtn');

const signoutbtn = document.getElementById('signoutbtn');

const userdetails = document.getElementById('userdetails');


const provider = new firebase.auth.GoogleAuthProvider();

signinbtn.onclick=()=> auth.signInWithPopup(provider);

signoutbtn.onclick=()=> auth.signOut();

auth.onAuthStateChanged(user=>{
    if(user){
        whensignedin.hidden=false;
        whensignedout.hidden=true;
        userdetails.innerHTML= `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    }
    else{
        whensignedin.hidden=true;
        whensignedout.hidden=false;
        userdetails.innerHTML='';
    }
});


const createThing = document.getElementById('creatething');
const thingsList = document.getElementById('thingsList');

const db = firebase.firestore();
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('things')

        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }
        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${doc.data().name}</li>`

                });

                thingsList.innerHTML = items.join('');

            });



    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
    
});