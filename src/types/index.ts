export type Step = 'welcome' | 'side-select' | 'category-list' | 'guest-list'

export interface PathItem {
  name: string
  step: Step
  side?: 'albert' | 'amy'
  category?: string
}
