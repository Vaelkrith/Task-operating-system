"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import React from "react"

type Merge<P, T> = Omit<P, keyof T> & T

type MotionComponentProps<T extends keyof typeof motion> = Merge<
  React.ComponentPropsWithoutRef<T>,
  HTMLMotionProps<T>
>

export const MotionDiv = (props: MotionComponentProps<"div">) => <motion.div {...props} />
export const MotionSpan = (props: MotionComponentProps<"span">) => <motion.span {...props} />
export const MotionP = (props: MotionComponentProps<"p">) => <motion.p {...props} />
export const MotionSection = (props: MotionComponentProps<"section">) => <motion.section {...props} />
export const MotionButton = (props: MotionComponentProps<"button">) => <motion.button {...props} />
