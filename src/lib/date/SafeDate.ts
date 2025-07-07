export class SafeDate {
  private readonly raw: Date

  constructor(input: string | Date) {
    let parsed: Date

    if (typeof input === 'string') {
      const needsTimeFix = /^\d{4}-\d{2}-\d{2}$/.test(input)
      parsed = needsTimeFix ? new Date(`${input}T12:00:00`) : new Date(input)
    } else {
      parsed = input
    }

    if (isNaN(parsed.getTime())) {
      throw new Error(
        `[SafeDate] Valor inválido recebido: ${JSON.stringify(input)}`,
      )
    }

    this.raw = new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
      12,
      0,
      0,
    )
  }

  static fromDateOnly(dateStr: string): SafeDate {
    return new SafeDate(dateStr)
  }

  static fromISOString(isoStr: string): SafeDate {
    return new SafeDate(isoStr)
  }

  toDate(): Date {
    return this.raw
  }

  toISOString(): string {
    return this.raw.toISOString()
  }

  /** Padrão para <input type="date" /> — yyyy-mm-dd */
  toDateOnly(): string {
    return this.toISOString().split('T')[0]
  }

  /** Formatação no estilo brasileiro — dd/mm/yyyy */
  toDateBR(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    }).format(this.raw)
  }

  /** Estilização local com dia da semana, útil pra dashboards */
  toFullLocaleBR(): string {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'long',
    }).format(this.raw)
  }

  isBeforeToday(): boolean {
    const today = new Date()
    const todayAtMidnight = new Date(today.toDateString())
    return this.raw.getTime() < todayAtMidnight.getTime()
  }

  isValid(): boolean {
    return !isNaN(this.raw.getTime())
  }
}
