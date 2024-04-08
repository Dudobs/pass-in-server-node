export function generateSlug(text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '-') // Substituir espaços por hífens
        .replace(/[^a-z0-9-]/g, '') // Remover caracteres não alfanuméricos exceto hífens
        .replace(/-+/g, '-') // Remover hífens duplicados
        .replace(/^-+/, '') // Remover hífens no início
        .replace(/-+$/, ''); // Remover hífens no final
}