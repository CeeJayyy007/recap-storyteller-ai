import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CryptoJS from "crypto-js";

const PASSCODE = "000478";
const ENCRYPTION_KEY = "admin-secure-key"; // In production, use a more secure key

interface AdminPasscodeModalProps {
  onAuthenticated: () => void;
}

export function AdminPasscodeModal({
  onAuthenticated,
}: AdminPasscodeModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const encryptedAuth = sessionStorage.getItem("adminAuth");
    if (encryptedAuth) {
      try {
        const decrypted = CryptoJS.AES.decrypt(
          encryptedAuth,
          ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        if (decrypted === PASSCODE) {
          setIsOpen(false);
          onAuthenticated();
          return;
        }
      } catch (error) {
        console.error("Error decrypting auth:", error);
      }
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === PASSCODE) {
      // Encrypt and store the passcode
      const encrypted = CryptoJS.AES.encrypt(
        PASSCODE,
        ENCRYPTION_KEY
      ).toString();
      sessionStorage.setItem("adminAuth", encrypted);
      setIsOpen(false);
      onAuthenticated();
    } else {
      setError("Invalid passcode");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          navigate("/dashboard");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Admin Access Required
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please enter the 6-digit passcode to access the admin dashboard. You
            will be redirected in {timeLeft} seconds if no valid passcode is
            entered.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            maxLength={6}
            placeholder="Enter 6-digit passcode"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            className="text-center text-2xl tracking-widest"
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full">
            Verify Passcode
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
