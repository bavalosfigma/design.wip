export const wipBackgrounds = [
  { id: 'gray', label: 'Gray', color: '#e2e2e2', mark: '#c7f8fb' },
  { id: 'lime', label: 'Lime', color: '#e9fea3', mark: '#ffffff' },
  { id: 'cyan', label: 'Cyan', color: '#d1f7fa', mark: '#721c1c' },
  { id: 'purple', label: 'Purple', color: '#c4a1cf', mark: '#e2e2e2' },
  { id: 'maroon', label: 'Maroon', color: '#692320', dark: true, mark: '#c7f8fb' },
]

export function wipBackgroundById(id) {
  return wipBackgrounds.find((swatch) => swatch.id === id) ?? wipBackgrounds[0]
}
