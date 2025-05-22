"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter(); // Initialize the router

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login flow unchanged
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        await supabase.auth.refreshSession();
        router.push("/chats");
      } else {
        // Signup flow
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username || "" } },
        });
        if (error) throw error;

        // Get the newly signed up user info
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;

        if (userData?.user) {
          // Insert user profile manually into public.profiles table
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userData.user.id, // assuming profiles.id references users.id
                username: username || "",
                email: email,
                // add any other profile fields you want to initialize here
              },
            ]);

          if (profileError) {
            console.error("Error inserting profile:", profileError);
            setError("Failed to create user profile.");
            setLoading(false);
            return;
          }
        } else {
          console.error("No user data found after signup.");
          setError("User creation failed.");
          setLoading(false);
          return;
        }

        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Login to continue" : "Register to get started"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {!isLogin && (
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            onClick={handleAuth}
            disabled={loading}
            className="w-full font-semibold cursor-pointer"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-muted-foreground cursor-pointer"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
