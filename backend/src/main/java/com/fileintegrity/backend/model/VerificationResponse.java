package com.fileintegrity.backend.model;

public class VerificationResponse {

    private String fileName;

    private boolean integrityValid;

    public VerificationResponse(String fileName, boolean integrityValid) {
        this.fileName = fileName;
        this.integrityValid = integrityValid;
    }

    public String getFileName() {
        return fileName;
    }

    public boolean isIntegrityValid() {
        return integrityValid;
    }
}