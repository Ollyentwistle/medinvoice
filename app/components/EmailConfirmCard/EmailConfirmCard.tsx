"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";

interface EmailConfirmationProps {
  onBackToLogin?: () => void;
}

export function EmailConfirmCard({ onBackToLogin }: EmailConfirmationProps) {
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription className="text-base">
            We've sent a confirmation link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Almost there!</p>
                <p>
                  Click the confirmation link in your email to activate your
                  MedInvoice account. The link will expire in 24 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              Can't see the email? Check your spam folder
            </p>
          </div>

          <div className="pt-4 border-t">
            <Button variant="ghost" onClick={onBackToLogin} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
