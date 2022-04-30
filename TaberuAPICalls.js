/*
    TODO:

        This file has a list of all the API calls that we aren't making use of yet.
        These need to be integrated at some point, but I can't do it now. I didn't
        want them cluttering up the code, so for the time being they live
        here until we can eventually scrap this entire file
        once all of these calls are integrated into the right places.
*/

/*
    let res = fetch("http://taberu.frp.ryanbuxton.com/register", 
        {
            method: 'GET'
        }).
        then((response) => response.json()).
        then((responseData) =>
        {
           console.log(responseData);
        }).catch((error) => 
        {
            console.error(error);
        });
    */

    /*
    let res = fetch("http://taberu.frp.ryanbuxton.com/trend", 
    {
        method: 'POST',
        body: {
            "fsid": "4b3c46e6f964a520918325e3",
            "uid": "0"
        }
    }).
    then((response) => response.json()).
    then((responseData) =>
    {
        console.log(responseData);
    }).catch((error) => 
    {
        console.error(error);
    });
    */

    /*
    let res = fetch("http://taberu.frp.ryanbuxton.com/trends", 
    {
        method: 'GET',
    }).
    then((response) => response.json()).
    then((responseData) =>
    {
        console.log(responseData);
    }).catch((error) => 
    {
        console.error(error);
    });
    */


    /*
    axios.get("http://taberu.frp.ryanbuxton.com/prediction",
    {
        params: 
        {
            "last": ["4b3c46e6f964a520918325e3", "56426b4c498ef77ac0e2baee", "4a9b4484f964a520de3420e3", 
                     "55271016498ecaf91050778f", "4a6289b3f964a52041c41fe3"]
        }
    }).
    then((responseData) =>
    {
        console.log(responseData);
    }).catch((error) => 
    {
        console.error(error);
    });
    */

    /*
    let res = fetch("http://taberu.frp.ryanbuxton.com/place?fsid=4a9b4484f964a520de3420e3", 
    {
        method: 'GET'
    }).
    then((response) => response.json()).
    then((responseData) =>
    {
        console.log(responseData);
    }).catch((error) => 
    {
        console.error(error);
    });
    */