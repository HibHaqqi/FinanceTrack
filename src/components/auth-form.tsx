'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from './logo';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would handle login or registration logic
    console.log(values);
  }

  const isLogin = mode === 'login';

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-fit">
          <Logo />
        </div>
        <CardTitle className="text-2xl">{isLogin ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Sign in to continue to FinanceFlow.' : 'Enter your details to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link href={isLogin ? '/register' : '/login'} className="underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
