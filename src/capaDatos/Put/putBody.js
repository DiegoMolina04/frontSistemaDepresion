async function putBody(datos, url) {

    const data = await fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {

            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })

    const respuesta = await data.json();

    return (
        await respuesta

    );
};

export default putBody;