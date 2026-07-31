package dev.karamousalis.supplypilot.shared;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, long id) {
        super(resource + " " + id + " was not found.");
    }
}
