document.addEventListener('DOMContentLoaded', () => {
    const allCopyButtons = document.querySelectorAll('.copy-btn');

    allCopyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.code-block');
            const codeToCopy = codeBlock.querySelector('pre code').innerText;

            navigator.clipboard.writeText(codeToCopy).then(() => {
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fa-solid fa-check"></i>';
                button.title = 'Copiado!';

                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.title = 'Copiar código';
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar: ', err);
                alert('Não foi possível copiar o código.');
            });
        });
    });
});
