export const required = (error = 'Поле обязательно') =>
		v => !!v || error

export const selectRequired = (error = 'Поле обязательно') =>
		v => v > 0 || error

export const minLength = (length, error = `Минимум ${length} символов`) =>
		v => !!v && v.length >= length || error

export const maxLength = (length, error = `Не более ${length} символов`) =>
		v => !!v && v.length <= length || error

export const password = (error = 'Не менее 6 символов (цифры и английские буквы)') =>
	v => /^[a-z0-9]{6,}$/i.test(v) || error

export const integer = (error = 'Должно быть целым числом') =>
	v => /(?<=\s|^)\d+(?=\s|$)/i.test(v) || error

export const minNumber = (min, error = `Должно быть не менее ${min}`) =>
		v => Number(v) >= min || error

export const maxNumber = (max, error = `Должно быть не более ${max}`) =>
		v => Number(v) <= max || error

export const intervalNumber = (min, max, error = `Должно быть от ${min} до ${max}`) =>
		v => Number(v) >= min && Number(v) <= max || error
