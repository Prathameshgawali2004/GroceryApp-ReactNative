const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// GET

export const getData = async () => {
    try {
        const res = await fetch(BASE_URL);
        return await res.json();
    } catch (err) {
        console.log('GET ERROR:', err);
        throw err;
    }
}

// POST

export const postData = async (body) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await res.json();
    } catch (err) {
        console.log('POST ERROR:', err);
        throw err;
    }
}

// PUT

export const updateData = async (id, body) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        return await res.json();
    } catch (err) {
        console.log('PUT ERROR:', err);
        throw err;
    }
};


// DELETE
export const deleteData = async (id) => {
    try {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        return true;
    } catch (err) {
        console.log('DELETE ERROR:', err);
        throw err;
    }
}


