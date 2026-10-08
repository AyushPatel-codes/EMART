package com.Project.EMART.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String product, int available) { super("Insufficient stock for " + product + ". Available: " + available); }
}
