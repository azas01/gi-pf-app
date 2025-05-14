const avatarColors = [
  '#d81b60', '#efebe9', '#1565c0', '#651fff', '#ffc400', '#bdbdbd', '#08acf2','#673ab7', '#d1c4e9', '#faab96'
];

export function getAvatarColor(userId: number) {
  return avatarColors[(userId-1) % avatarColors.length];
}

export function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}
