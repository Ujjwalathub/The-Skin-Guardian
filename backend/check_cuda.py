import torch

print('PyTorch version:', torch.__version__)
print('CUDA available:', torch.cuda.is_available())
print('CUDA version:', torch.version.cuda if torch.cuda.is_available() else 'N/A')
print('Device count:', torch.cuda.device_count() if torch.cuda.is_available() else 0)
if torch.cuda.is_available():
    print('GPU Name:', torch.cuda.get_device_name(0))
    print('GPU Memory:', torch.cuda.get_device_properties(0).total_memory / 1024**3, 'GB')
