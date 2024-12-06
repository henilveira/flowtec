async function refreshToken() {
    const res = await fetch('http://127.0.0.1:8000/api/accounts/token/refresh/', {
      method: 'POST',
      credentials: 'include', // Envia cookies junto com a requisição
    });
  
    if (res.ok) {
      const data = await res.json();
      // Aqui você pode salvar o novo token (caso esteja sendo usado em localStorage ou contexto)
      return data;
    } else {
      throw new Error('Failed to refresh token');
    }
  }
  