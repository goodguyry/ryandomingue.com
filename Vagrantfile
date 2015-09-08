# -*- mode: ruby -*-
# vi: set ft=ruby :

# External YAML file for variables
# h/t http://stackoverflow.com/a/23589414
require 'yaml'
settings = YAML.load_file '_env/config.yaml'

local_dir = settings['paths']['local_dir']
guest_dir = settings['paths']['guest_dir']
guest_port = settings['strings']['guest_port']
host_port = settings['strings']['host_port']
vm_name = settings['strings']['vm_name']
vhost = settings['strings']['vhost']
ip_address = settings['strings']['ip_address']

Vagrant.configure(2) do |config|
  config.vm.box = "dreamhost"
  config.vm.box_url = "http://ryandomingue.com/public/dreamhost.box"

  config.vm.network :forwarded_port, guest: guest_port, host: host_port, auto_correct: true

  config.vm.synced_folder local_dir, guest_dir, create: true, owner: "www-data", group: "www-data"

  config.vm.provider "virtualbox" do |vb|
    vb.name = vm_name
    vb.customize ["modifyvm", :id, "--memory", "1024"]
  end

  config.vm.provision :shell, path: "_env/user.sh"

  config.vm.hostname = vhost
  config.vm.network :private_network, ip: ip_address
end
