import type { ButtonHTMLAttributes, Ref } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant, size, className, type = 'button', ref, ...rest }: ButtonProps) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...rest} />
}

type ButtonLinkProps = LinkProps & { variant?: ButtonVariant; size?: ButtonSize }

/** Internal route link styled as a button. For external URLs use <a className={buttonClasses()}>. */
export function ButtonLink({ variant, size, className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, typeof className === 'string' ? className : undefined)} {...rest} />
}
