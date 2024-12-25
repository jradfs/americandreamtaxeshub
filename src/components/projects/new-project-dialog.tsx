'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog'
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Completely remove estimated_hours
const projectSchema = z.object({
    name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    due_date: z.date().optional(),
    start_date: z.date().optional(),
    stage: z.string().optional(),
    client_id: z.string().optional(),
    template_id: z.string().optional()
})

export function NewProjectDialog() {
    const [open, setOpen] = useState(false)
    const supabase = createClientComponentClient()

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            status: 'todo',
            priority: 'medium'
        }
    })

    const onSubmit = async (